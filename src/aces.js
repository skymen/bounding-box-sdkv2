import { action, condition, expression } from "../template/aceDefine.js";

const general = "general";

const includeChildrenParam = (desc) => ({
  id: "includeChildren",
  name: "Include Children",
  desc,
  type: "combo",
  initialValue: "none",
  items: [{ none: "None" }, { own: "Own" }, { all: "All" }],
});

action(
  general,
  "SetEnabled",
  {
    highlight: true,
    listName: "Set Enabled",
    displayText: "{my}: Set enabled to [i]{0}[/i]",
    description: "Set whether the bounding box is enabled.",
    params: [
      {
        id: "enabled",
        name: "Enabled",
        desc: "Whether the bounding box is enabled.",
        type: "boolean",
        initialValue: "true",
      },
    ],
  },
  function (enabled) {
    this.enabled = enabled;
  },
  false
);

action(
  general,
  "AddObjectToCustomList",
  {
    highlight: false,
    listName: "Add object to custom list",
    displayText:
      "{my}: Add [b]{0}[/b] to custom list (include children: [i]{1}[/i])",
    description: "Add an object to the custom list.",
    params: [
      {
        id: "object",
        name: "Object",
        desc: "The object to add to the custom list.",
        type: "object",
        allowedPluginIds: ["<world>"],
      },
      includeChildrenParam("Whether to include the children of the object."),
    ],
  },
  function (object, includeChildren) {
    if (!object) return;
    this.addInstancesToList(object.getPickedInstances(), includeChildren);
  },
  false
);

action(
  general,
  "RemoveFromList",
  {
    highlight: false,
    listName: "Remove from list",
    displayText: "{my}: Remove [b]{0}[/b] from custom list",
    description: "Remove an object from the custom list.",
    params: [
      {
        id: "object",
        name: "Object",
        desc: "The object to remove from the custom list.",
        type: "object",
        allowedPluginIds: ["<world>"],
      },
    ],
  },
  function (object) {
    if (!object) return;
    this.removeInstancesFromList(object.getPickedInstances());
  },
  false
);

action(
  general,
  "ClearList",
  {
    highlight: false,
    listName: "Clear list",
    displayText: "{my}: Clear custom list",
    description: "Clear the custom list.",
    params: [],
  },
  function () {
    this.customList = [];
  }
);

action(
  general,
  "AddLayerToCustomList",
  {
    highlight: false,
    listName: "Add layer to custom list",
    displayText:
      "{my}: Add [b]{0}[/b] to custom list (include children: [i]{1}[/i], include sub layers: [i]{2}[/i])",
    description: "Add a layer to the custom list.",
    params: [
      {
        id: "layer",
        name: "Layer",
        desc: "The layer to add to the custom list.",
        type: "layer",
      },
      includeChildrenParam("Whether to include the children of the instances."),
      {
        id: "includeSubLayers",
        name: "Include Sub Layers",
        desc: "Whether to include the sub layers of the layer.",
        type: "combo",
        initialValue: "none",
        items: [{ none: "None" }, { own: "Own" }, { all: "All" }],
      },
    ],
  },
  function (layer, includeChildren, includeSubLayers) {
    this.addLayerToList(layer, includeChildren, includeSubLayers);
  },
  false
);

action(
  general,
  "RemoveLayerFromList",
  {
    highlight: false,
    listName: "Remove layer from list",
    displayText: "{my}: Remove [b]{0}[/b] from custom list",
    description: "Remove a layer from the custom list.",
    params: [
      {
        id: "layer",
        name: "Layer",
        desc: "The layer to remove from the custom list.",
        type: "layer",
      },
    ],
  },
  function (layer) {
    this.removeLayerEntry(layer);
  },
  false
);

action(
  general,
  "SetBoundingBoxMode",
  {
    highlight: false,
    listName: "Set bounding box mode",
    displayText: "{my}: Set bounding box mode to [i]{0}[/i]",
    description: "Set the bounding box mode.",
    params: [
      {
        id: "mode",
        name: "Mode",
        desc: "The bounding box mode.",
        type: "combo",
        initialValue: "own",
        items: [
          { custom: "Custom List" },
          { own: "Own Children" },
          { all: "All Children" },
        ],
      },
    ],
  },
  function (mode) {
    this.mode = mode;
  },
  false
);

action(
  general,
  "UpdateBoundingBox",
  {
    highlight: true,
    listName: "Update bounding box",
    displayText: "{my}: Update bounding box",
    description: "Update the bounding box.",
    params: [],
  },
  function () {
    this.updateBox();
  }
);

condition(
  general,
  "IsEnabled",
  {
    highlight: false,
    listName: "Is enabled",
    displayText: "{my}: Is enabled",
    description: "Check whether the bounding box is enabled.",
    params: [],
  },
  function () {
    return this.enabled;
  },
  false
);

expression(
  general,
  "Count",
  {
    highlight: false,
    returnType: "number",
    description: "The number of objects in the bounding box.",
    params: [],
  },
  function () {
    return this.count;
  },
  false
);
