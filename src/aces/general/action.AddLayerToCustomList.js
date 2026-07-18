export const config = {
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
    {
      id: "includeChildren",
      name: "Include Children",
      desc: "Whether to include the children of the instances.",
      type: "combo",
      initialValue: "none",
      items: [
        {
          none: "None",
        },
        {
          own: "Own",
        },
        {
          all: "All",
        },
      ],
    },
    {
      id: "includeSubLayers",
      name: "Include Sub Layers",
      desc: "Whether to include the sub layers of the layer.",
      type: "combo",
      initialValue: "none",
      items: [
        {
          none: "None",
        },
        {
          own: "Own",
        },
        {
          all: "All",
        },
      ],
    },
  ],
};

export const expose = false;

export default function (layer, includeChildren, includeSubLayers) {
  this.addLayerToList(layer, includeChildren, includeSubLayers);
}
