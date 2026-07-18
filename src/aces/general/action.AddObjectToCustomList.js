export const config = {
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
    {
      id: "includeChildren",
      name: "Include Children",
      desc: "Whether to include the children of the object.",
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

export default function (object, includeChildren) {
  if (!object) return;
  this.addInstancesToList(object.getPickedInstances(), includeChildren);
}
