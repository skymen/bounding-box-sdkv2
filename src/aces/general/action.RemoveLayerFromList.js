export const config = {
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
};

export const expose = false;

export default function (layer) {
  this.removeLayerEntry(layer);
}
