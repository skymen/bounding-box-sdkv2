export const config = {
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
};

export const expose = false;

export default function (object) {
  if (!object) return;
  this.removeInstancesFromList(object.getPickedInstances());
}
