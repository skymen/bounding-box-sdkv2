export const config = {
  highlight: false,
  returnType: "number",
  description: "The number of objects in the bounding box.",
  params: [],
};

export const expose = false;

export default function () {
  return this.count;
}
