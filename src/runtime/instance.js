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

    isInstAlive(inst) {
      if (!inst) return false;
      try {
        void inst.x;
        return true;
      } catch (e) {
        return false;
      }
    }

    resolveLayer(layerParam) {
      if (layerParam && typeof layerParam === "object") return layerParam;
      if (layerParam === null || layerParam === undefined) return null;
      try {
        return this.runtime.layout.getLayer(layerParam);
      } catch (e) {
        return null;
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

    addLayerToList(layerParam, instMode, layerMode) {
      const layer = this.resolveLayer(layerParam);
      if (!layer) return;
      this.customList.push({ isLayer: true, layer, instMode, layerMode });
    }

    removeLayerEntry(layerParam) {
      const layer = this.resolveLayer(layerParam);
      if (!layer) return;
      this.customList = this.customList.filter(
        (x) => !x.isLayer || (x.layer !== layer && x.layer.index !== layer.index)
      );
    }

    collectFromInst(inst, mode, map) {
      if (!this.isInstAlive(inst)) return;
      map.set(inst.uid, inst);
      if (mode !== 0) {
        let children = [];
        try {
          children = [...inst.children()];
        } catch (e) {}
        for (const child of children) {
          this.collectFromInst(child, mode === 1 ? 0 : 2, map);
        }
      }
    }

    getLayerEntryLayers(layer, layerMode) {
      const layers = [layer];
      if (layerMode !== 0) {
        let all = [];
        try {
          all = this.runtime.layout.getAllLayers();
        } catch (e) {}
        const addChildren = (parent, recursive) => {
          for (const l of all) {
            let p;
            try {
              p = l.parentLayer;
            } catch (e) {
              continue;
            }
            if (p === parent) {
              layers.push(l);
              if (recursive) addChildren(l, true);
            }
          }
        };
        addChildren(layer, layerMode === 2);
      }
      return layers;
    }

    collectFromLayer(layer, instMode, layerMode, map) {
      const indexSet = new Set(
        this.getLayerEntryLayers(layer, layerMode).map((l) => l.index)
      );
      // SDK v2 has no per-layer instance list, so scan every instance and
      // filter by layer (v1 used the internal layer._GetInstances()).
      for (const key in this.runtime.objects) {
        const objectClass = this.runtime.objects[key];
        let instances;
        try {
          instances = objectClass.getAllInstances();
        } catch (e) {
          continue;
        }
        for (const inst of instances) {
          let instLayer;
          try {
            instLayer = inst.layer;
          } catch (e) {
            continue;
          }
          if (!instLayer) continue;
          if (indexSet.has(instLayer.index)) {
            this.collectFromInst(inst, instMode, map);
          }
        }
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
        let children = [];
        try {
          children = [...this.instance.children()];
        } catch (e) {}
        for (const child of children) {
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
        let bbox;
        try {
          bbox = inst.getBoundingBox();
        } catch (e) {
          continue;
        }
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
          // v1 savegames stored layer SIDs (numbers). Those cannot be
          // resolved with the public API, so only names are restored.
          if (typeof x.layer !== "string") continue;
          const layer = this.resolveLayer(x.layer);
          if (!layer) continue;
          this.customList.push({
            isLayer: true,
            layer,
            instMode: x.instMode,
            layerMode: x.layerMode,
          });
        } else {
          if (x.inst === null || x.inst === undefined) continue;
          let inst = null;
          try {
            inst = this.runtime.getInstanceByUid(x.inst);
          } catch (e) {}
          if (!inst) continue;
          this.customList.push({ isLayer: false, inst, mode: x.mode });
        }
      }
    }
  };
}
