export const config = {
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
};

export const expose = false;

export default function (enabled) {
  this.enabled = enabled;
}
