import { id, addonType } from "../../config.caw.js";
import AddonTypeMap from "../../template/addonTypeMap.js";

export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
      this.mode = 0;
      this._enabled = true;
      this.objectMap = new Map();
      this.customList = [];

      const properties = this._getInitProperties();
      if (properties) {
        this.mode = properties[0];
        this._enabled = properties[1];
      }
      this._setTicking(this._enabled);
    }

    get enabled() {
      return this._enabled;
    }

    set enabled(value) {
      if (this._enabled === !!value) return;
      this._enabled = !!value;
      this._setTicking(this._enabled);
    }

    get count() {
      return this.getAllObjects().length;
    }

    _trigger(method) {
      this.dispatch(method);
      super._trigger(self.C3[AddonTypeMap[addonType]][id].Cnds[method]);
    }

    on(tag, callback, options) {
      if (!this.events[tag]) {
        this.events[tag] = [];
      }
      this.events[tag].push({ callback, options });
    }

    off(tag, callback) {
      if (this.events[tag]) {
        this.events[tag] = this.events[tag].filter(
          (event) => event.callback !== callback
        );
      }
    }

    dispatch(tag) {
      if (this.events[tag]) {
        this.events[tag].forEach((event) => {
          if (event.options && event.options.params) {
            const fn = self.C3[AddonTypeMap[addonType]][id].Cnds[tag];
            if (fn && !fn.call(this, ...event.options.params)) {
              return;
            }
          }
          event.callback();
          if (event.options && event.options.once) {
            this.off(tag, event.callback);
          }
        });
      }
    }

    _release() {
      this.customList = [];
      this.objectMap.clear();
      super._release();
    }

    // Destroyed IWorldInstance interfaces throw on any access and SDK v2 has
    // no public liveness check, so this try/catch is the detection mechanism.
    isInstAlive(inst) {
      try {
        void inst.x;
        return true;
      } catch (e) {
        return false;
      }
    }

    addInstancesToList(instances, mode) {
      for (const inst of instances) {
        this.customList.push({ isLayer: false, inst, mode });
      }
    }

    removeInstancesFromList(instances) {
      this.customList = this.customList.filter(
        (x) => x.isLayer || !instances.includes(x.inst)
      );
    }

    addLayerToList(layer, instMode, layerMode) {
      this.customList.push({ isLayer: true, layer, instMode, layerMode });
    }

    removeLayerEntry(layer) {
      this.customList = this.customList.filter(
        (x) => !x.isLayer || x.layer !== layer
      );
    }

    collectFromInst(inst, mode, map) {
      if (!this.isInstAlive(inst)) return;
      map.set(inst.uid, inst);
      if (mode !== 0) {
        for (const child of inst.children()) {
          this.collectFromInst(child, mode === 1 ? 0 : 2, map);
        }
      }
    }

    getLayerEntryLayers(layer, layerMode) {
      const layers = [layer];
      if (layerMode !== 0) {
        const all = this.runtime.layout.getAllLayers();
        const addChildren = (parent, recursive) => {
          for (const l of all) {
            if (l.parentLayer === parent) {
              layers.push(l);
              if (recursive) addChildren(l, true);
            }
          }
        };
        addChildren(layer, layerMode === 2);
      }
      return layers;
    }

    // SDK v2 has no per-layer instance list (feature request pending), so this
    // scans every instance in the project and filters by layer. Replace this
    // single function when Construct exposes one.
    getInstancesOnLayers(layers) {
      const wanted = new Set(layers);
      const result = [];
      for (const key in this.runtime.objects) {
        for (const inst of this.runtime.objects[key].getAllInstances()) {
          if (wanted.has(inst.layer)) result.push(inst);
        }
      }
      return result;
    }

    collectFromLayer(layer, instMode, layerMode, map) {
      const layers = this.getLayerEntryLayers(layer, layerMode);
      for (const inst of this.getInstancesOnLayers(layers)) {
        this.collectFromInst(inst, instMode, map);
      }
    }

    getAllObjects() {
      const map = this.objectMap;
      map.clear();

      this.customList = this.customList.filter((x) => {
        if (x.isLayer) {
          this.collectFromLayer(x.layer, x.instMode, x.layerMode, map);
          return true;
        }
        if (!this.isInstAlive(x.inst)) return false;
        this.collectFromInst(x.inst, x.mode, map);
        return true;
      });

      if (this.mode !== 0) {
        for (const child of this.instance.children()) {
          this.collectFromInst(child, this.mode === 1 ? 0 : 2, map);
        }
      }

      return Array.from(map.values());
    }

    updateBox() {
      let minX = Number.MAX_SAFE_INTEGER;
      let minY = Number.MAX_SAFE_INTEGER;
      let maxX = Number.MIN_SAFE_INTEGER;
      let maxY = Number.MIN_SAFE_INTEGER;
      let anyInst = false;

      for (const inst of this.getAllObjects()) {
        const bbox = inst.getBoundingBox();
        anyInst = true;
        minX = Math.min(minX, bbox.left);
        minY = Math.min(minY, bbox.top);
        maxX = Math.max(maxX, bbox.right);
        maxY = Math.max(maxY, bbox.bottom);
      }

      if (!anyInst) {
        minX = 0;
        minY = 0;
        maxX = 0;
        maxY = 0;
      }

      const host = this.instance;
      const width = maxX - minX;
      const height = maxY - minY;

      host.width = width;
      host.height = height;
      host.x = minX + host.originX * width;
      host.y = minY + host.originY * height;
    }

    _tick() {
      this.updateBox();
    }

    _getDebuggerProperties() {
      return [
        {
          title: "Bounding Box",
          properties: [
            { name: "Mode", value: this.mode, readonly: true },
            { name: "Enabled", value: this._enabled, readonly: true },
            { name: "Count", value: this.count, readonly: true },
            {
              name: "List entries",
              value: this.customList.length,
              readonly: true,
            },
          ],
        },
      ];
    }

    _saveToJson() {
      return {
        mode: this.mode,
        enabled: this._enabled,
        customList: this.customList.map((x) => {
          if (x.isLayer) {
            return {
              isLayer: true,
              layer: x.layer.name,
              instMode: x.instMode,
              layerMode: x.layerMode,
            };
          }
          return {
            isLayer: false,
            inst: this.isInstAlive(x.inst) ? x.inst.uid : null,
            mode: x.mode,
          };
        }),
      };
    }

    _loadFromJson(o) {
      this.mode = o.mode;
      this.enabled = o.enabled;
      this.customList = [];
      for (const x of o.customList || []) {
        if (x.isLayer) {
          // v1 savegames stored layer SIDs (numbers), which cannot be resolved
          // with the public API. Only name entries (v2 saves) are restored.
          if (typeof x.layer !== "string") continue;
          const layer = this.runtime.layout.getLayer(x.layer);
          if (!layer) continue;
          this.customList.push({
            isLayer: true,
            layer,
            instMode: x.instMode,
            layerMode: x.layerMode,
          });
        } else {
          if (x.inst === null || x.inst === undefined) continue;
          const inst = this.runtime.getInstanceByUid(x.inst);
          if (!inst) continue;
          this.customList.push({ isLayer: false, inst, mode: x.mode });
        }
      }
    }
  };
}
