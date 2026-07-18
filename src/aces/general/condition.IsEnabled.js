export const config = {
  highlight: false,
  listName: "Is enabled",
  displayText: "{my}: Is enabled",
  description: "Check whether the bounding box is enabled.",
  params: [],
};

export const expose = false;

export default function () {
  return this.enabled;
}
