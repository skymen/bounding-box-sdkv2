import {
  ADDON_CATEGORY,
  ADDON_TYPE,
  PLUGIN_TYPE,
  PROPERTY_TYPE,
} from "./template/enums.js";
import _version from "./version.js";
export const addonType = ADDON_TYPE.BEHAVIOR;
export const type = PLUGIN_TYPE.OBJECT;
export const id = "skymen_bounding_box";
export const name = "Bounding Box";
export const version = _version;
export const minConstructVersion = undefined;
export const author = "skymen";
export const website =
  "https://www.construct.net/en/make-games/addons/1184/bounding-box";
export const documentation =
  "https://www.construct.net/en/make-games/addons/1184/bounding-box";
export const description =
  "Resizes the object to fit the bounding box of its children or a custom list of instances and layers";
export const category = ADDON_CATEGORY.GENERAL;

export const hasDomside = false;
export const files = {
  extensionScript: {
    enabled: false,
    watch: false,
    targets: ["x86", "x64"],
    name: "MyExtension",
  },
  fileDependencies: [],
  remoteFileDependencies: [],
  cordovaPluginReferences: [],
  cordovaResourceFiles: [],
};

export const aceCategories = {
  general: "General",
};

export const info = {
  Set: {
    CanBeBundled: true,
    IsDeprecated: false,
    IsOnlyOneAllowed: false,
  },
  AddCommonACEs: {
    Position: false,
    SceneGraph: false,
    Size: false,
    Angle: false,
    Appearance: false,
    ZOrder: false,
  },
};

export const properties = [
  {
    type: PROPERTY_TYPE.COMBO,
    id: "boundingBoxMode",
    options: {
      initialValue: "own",
      items: [
        { custom: "Custom List" },
        { own: "Own Children" },
        { all: "All Children" },
      ],
    },
    name: "Bounding Box Mode",
    desc: "The bounding box mode. Own children: only direct children. All children: The entire hierarchy. Custom list: only the children in the custom list.",
  },
  {
    type: PROPERTY_TYPE.CHECK,
    id: "enabled",
    options: {
      initialValue: true,
    },
    name: "Enabled",
    desc: "Whether the bounding box is enabled.",
  },
];
