<img src="./examples/cover.webp" width="150" /><br>
# Bounding Box
<i>Resizes the object to fit the bounding box of its children or a custom list of instances and layers</i> <br>
### Version 2.0.0.2

[<img src="https://placehold.co/200x50/4493f8/FFF?text=Download&font=montserrat" width="200"/>](https://github.com/skymen/bounding-box-sdkv2/releases/download/skymen_bounding_box-2.0.0.2.c3addon/skymen_bounding_box-2.0.0.2.c3addon)
<br>
<sub> [See all releases](https://github.com/skymen/bounding-box-sdkv2/releases) </sub> <br>

#### What's New in 2.0.0.2
- **Changed:** ACE definitions moved to one file per ACE. No behavior change.

<sub>[View full changelog](#changelog)</sub>

---
<b><u>Author:</u></b> skymen <br>
<b>[Construct Addon Page](https://www.construct.net/en/make-games/addons/1184/bounding-box)</b>  <br>
<b>[Addon Website](https://www.construct.net/en/make-games/addons/1184/bounding-box)</b>  <br>
<b>[Documentation](https://www.construct.net/en/make-games/addons/1184/bounding-box)</b>  <br>
<sub>Made using [CAW](https://marketplace.visualstudio.com/items?itemName=skymen.caw) </sub><br>

## Table of Contents
- [Usage](#usage)
- [Examples Files](#examples-files)
- [Properties](#properties)
- [Actions](#actions)
- [Conditions](#conditions)
- [Expressions](#expressions)
---
## Usage
To build the addon, run the following commands:

```
npm i
npm run build
```

To run the dev server, run

```
npm i
npm run dev
```

## Examples Files
| Description | Download |
| --- | --- |
| boundingbox-test-suite | [<img src="https://placehold.co/120x30/4493f8/FFF?text=Download&font=montserrat" width="120"/>](https://github.com/skymen/bounding-box-sdkv2/raw/refs/heads/main/examples/boundingbox-test-suite.c3p) |

---
## Properties
| Property Name | Description | Type |
| --- | --- | --- |
| Bounding Box Mode | The bounding box mode. Own children: only direct children. All children: The entire hierarchy. Custom list: only the children in the custom list. | combo |
| Enabled | Whether the bounding box is enabled. | check |


---
## Actions
| Action | Description | Params
| --- | --- | --- |
| Add layer to custom list | Add a layer to the custom list. | Layer             *(layer)* <br>Include Children             *(combo)* <br>Include Sub Layers             *(combo)* <br> |
| Add object to custom list | Add an object to the custom list. | Object             *(object)* <br>Include Children             *(combo)* <br> |
| Clear list | Clear the custom list. |  |
| Remove from list | Remove an object from the custom list. | Object             *(object)* <br> |
| Remove layer from list | Remove a layer from the custom list. | Layer             *(layer)* <br> |
| Set bounding box mode | Set the bounding box mode. | Mode             *(combo)* <br> |
| Set Enabled | Set whether the bounding box is enabled. | Enabled             *(boolean)* <br> |
| Update bounding box | Update the bounding box. |  |


---
## Conditions
| Condition | Description | Params
| --- | --- | --- |
| Is enabled | Check whether the bounding box is enabled. |  |


---
## Expressions
| Expression | Description | Return Type | Params
| --- | --- | --- | --- |
| Count | The number of objects in the bounding box. | number |  | 


---
## Changelog

**2.0.0.2**
- **Changed:** ACE definitions moved to one file per ACE. No behavior change.

**2.0.0.1**
- **Changed:** Layer handling cleaned up: layer parameters are used directly as layer interfaces, sub layer lookup uses parentLayer, and the whole-project instance scan is isolated in one function so it can be swapped out when Construct adds a per-layer instance list. Removed defensive fallbacks that could hide errors.

**2.0.0.0**
- **Added:** SDK v2 port, built with CAW. Projects made with the SDK v1 version load without changes. Added debugger panel support.
- **Changed:** Layer entries in savegames are now stored by layer name instead of internal SID. Layer entries from old v1 savegames cannot be restored and are dropped. Instance entries still restore fine.
- **Fixed:** Destroyed instances are now dropped from the custom list instead of leaving stale entries.
