export const config = {
  highlight: false,
  listName: "Clear list",
  displayText: "{my}: Clear custom list",
  description: "Clear the custom list.",
  params: [],
};

export const expose = true;

export default function () {
  this.customList = [];
}
