export const config = {
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
        {
          custom: "Custom List",
        },
        {
          own: "Own Children",
        },
        {
          all: "All Children",
        },
      ],
    },
  ],
};

export const expose = false;

export default function (mode) {
  this.mode = mode;
}
