export const config = {
  highlight: true,
  listName: "Update bounding box",
  displayText: "{my}: Update bounding box",
  description: "Update the bounding box.",
  params: [],
};

export const expose = true;

export default function () {
  this.updateBox();
}
