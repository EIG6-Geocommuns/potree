
export * from "./Actions.js";
export * from "./AnimationPath.js";
export * from "./Annotation.js";
export * from "./defines.js";
export * from "./Enum.js";
export * from "./EventDispatcher.js";
export * from "./Features.js";
export * from "./KeyCodes.js";
export * from "./LRU.js";
export * from "./PointCloudEptGeometry.js";
export * from "./PointCloudOctree.js";
export * from "./PointCloudOctreeGeometry.js";
export * from "./PointCloudTree.js";
export * from "./Points.js";
export * from "./Potree_update_visibility.js";
export * from "./PotreeRenderer.js";
export * from "./ProfileRequest.js";
export * from "./TextSprite.js";
export * from "./utils.js";
export * from "./Version.js";
export * from "./WorkerPool.js";
export * from "./XHRFactory.js";
export * from "./viewer/SaveProject.js";
export * from "./viewer/LoadProject.js";

export * from "./materials/ClassificationScheme.js";
export * from "./materials/EyeDomeLightingMaterial.js";
export * from "./materials/Gradients.js";
export * from "./materials/NormalizationEDLMaterial.js";
export * from "./materials/NormalizationMaterial.js";
export * from "./materials/PointCloudMaterial.js";

export * from "./loader/POCLoader.js";
export * from "./modules/loader/2.0/OctreeLoader.js";
export * from "./loader/EptLoader.js";
export * from "./loader/ept/BinaryLoader.js";
export * from "./loader/ept/LaszipLoader.js";
export * from "./loader/ept/ZstandardLoader.js";
export * from "./loader/PointAttributes.js";
export * from "./loader/ShapefileLoader.js";
export * from "./loader/GeoPackageLoader.js";

export * from "./utils/Box3Helper.js";
export * from "./utils/ClippingTool.js";
export * from "./utils/ClipVolume.js";
export * from "./utils/GeoTIFF.js";
export * from "./utils/Measure.js";
export * from "./utils/MeasuringTool.js";
export * from "./utils/Message.js";
export * from "./utils/PointCloudSM.js";
export * from "./utils/PolygonClipVolume.js";
export * from "./utils/Profile.js";
export * from "./utils/ProfileTool.js";
export * from "./utils/ScreenBoxSelectTool.js";
export * from "./utils/SpotLightHelper.js";
export * from "./utils/TransformationTool.js";
export * from "./utils/Volume.js";
export * from "./utils/VolumeTool.js";
export * from "./utils/Compass.js";

export * from "./viewer/viewer.js";
export * from "./viewer/Scene.js";
export * from "./viewer/HierarchicalSlider.js";
export {PropertiesPanel} from "./viewer/PropertyPanels/PropertiesPanel.js"

export * from "./modules/OrientedImages/OrientedImages.js";
export * from "./modules/Images360/Images360.js";
export * from "./modules/CameraAnimation/CameraAnimation.js";

export * from "./modules/loader/2.0/OctreeLoader.js";

export {OrbitControls} from "./navigation/OrbitControls.js";
export {FirstPersonControls} from "./navigation/FirstPersonControls.js";
export {EarthControls} from "./navigation/EarthControls.js";
export {DeviceOrientationControls} from "./navigation/DeviceOrientationControls.js";
export {VRControls} from "./navigation/VRControls.js";

export {BlurMaterial} from "./materials/BlurMaterial.js";
export {
	PointCloudArena4DGeometryNode,
	PointCloudArena4DGeometry
} from "./arena4d/PointCloudArena4DGeometry.js";
export * from "./Globals.js";

import "./extensions/OrthographicCamera.js";
import "./extensions/PerspectiveCamera.js";
import "./extensions/Ray.js";

import {OctreeLoader} from "./modules/loader/2.0/OctreeLoader.js";
import {POCLoader} from "./loader/POCLoader.js";
import {EptLoader} from "./loader/EptLoader.js";
import {PointCloudArena4D} from "./arena4d/PointCloudArena4D.js";
import {PointCloudArena4DGeometry} from "./arena4d/PointCloudArena4DGeometry.js";
import {PointCloudOctree} from "./PointCloudOctree.js";
import {ShaderChunk} from 'three';
import * as Globals from "./Globals.js";


export const setTHREEShaderChunk = (c) => {
	Object.assign(ShaderChunk, c);
}

console.log('Potree ' + Globals.version.major + '.' + Globals.version.minor + Globals.version.suffix);

export function loadPointCloud(path, name, callback){
	let loaded = function(e){
		e.pointcloud.name = name;
		callback(e);
	};

	let promise = new Promise( resolve => {

		// load pointcloud
		if (!path){
			// TODO: callback? comment? Hello? Bueller? Anyone?
		} else if (path.indexOf('ept.json') > 0) {
			EptLoader.load(path, function(geometry) {
				if (!geometry) {
					console.error(new Error(`failed to load point cloud from URL: ${path}`));
				}
				else {
					let pointcloud = new PointCloudOctree(geometry);
					//loaded(pointcloud);
					resolve({type: 'pointcloud_loaded', pointcloud: pointcloud});
				}
			});
		} else if (path.indexOf('cloud.js') > 0) {
			POCLoader.load(path, function (geometry) {
				if (!geometry) {
					//callback({type: 'loading_failed'});
					console.error(new Error(`failed to load point cloud from URL: ${path}`));
				} else {
					let pointcloud = new PointCloudOctree(geometry);
					// loaded(pointcloud);
					resolve({type: 'pointcloud_loaded', pointcloud: pointcloud});
				}
			});
		} else if (path.indexOf('metadata.json') > 0) {
			OctreeLoader.load(path).then(e => {
				let geometry = e.geometry;

				if(!geometry){
					console.error(new Error(`failed to load point cloud from URL: ${path}`));
				}else{
					let pointcloud = new PointCloudOctree(geometry);

					let aPosition = pointcloud.getAttribute("position");

					let material = pointcloud.material;
					material.elevationRange = [
						aPosition.range[0][2],
						aPosition.range[1][2],
					];

					// loaded(pointcloud);
					resolve({type: 'pointcloud_loaded', pointcloud: pointcloud});
				}
			});

			OctreeLoader.load(path, function (geometry) {
				if (!geometry) {
					//callback({type: 'loading_failed'});
					console.error(new Error(`failed to load point cloud from URL: ${path}`));
				} else {
					let pointcloud = new PointCloudOctree(geometry);
					// loaded(pointcloud);
					resolve({type: 'pointcloud_loaded', pointcloud: pointcloud});
				}
			});
		} else if (path.indexOf('.vpc') > 0) {
			PointCloudArena4DGeometry.load(path, function (geometry) {
				if (!geometry) {
					//callback({type: 'loading_failed'});
					console.error(new Error(`failed to load point cloud from URL: ${path}`));
				} else {
					let pointcloud = new PointCloudArena4D(geometry);
					// loaded(pointcloud);
					resolve({type: 'pointcloud_loaded', pointcloud: pointcloud});
				}
			});
		} else {
			//callback({'type': 'loading_failed'});
			console.error(new Error(`failed to load point cloud from URL: ${path}`));
		}
	});

	if(callback){
		promise.then(pointcloud => {
			loaded(pointcloud);
		});
	}else{
		return promise;
	}
};


// add selectgroup
(function($){
	$.fn.extend({
		selectgroup: function(args = {}){

			let elGroup = $(this);
			let rootID = elGroup.prop("id");
			let groupID = `${rootID}`;
			let groupTitle = (args.title !== undefined) ? args.title : "";

			let elButtons = [];
			elGroup.find("option").each((index, value) => {
				let buttonID = $(value).prop("id");
				let label = $(value).html();
				let optionValue = $(value).prop("value");

				let elButton = $(`
					<span style="flex-grow: 1; display: inherit">
					<label for="${buttonID}" class="ui-button" style="width: 100%; padding: .4em .1em">${label}</label>
					<input type="radio" name="${groupID}" id="${buttonID}" value="${optionValue}" style="display: none"/>
					</span>
				`);
				let elLabel = elButton.find("label");
				let elInput = elButton.find("input");

				elInput.change( () => {
					elGroup.find("label").removeClass("ui-state-active");
					elGroup.find("label").addClass("ui-state-default");
					if(elInput.is(":checked")){
						elLabel.addClass("ui-state-active");
					}else{
						//elLabel.addClass("ui-state-default");
					}
				});

				elButtons.push(elButton);
			});

			let elFieldset = $(`
				<fieldset style="border: none; margin: 0px; padding: 0px">
					<legend ${args.dataI18n ? `data-i18n=${args.dataI18n}` : ""}>
						${args.dataI18n ? "" : groupTitle}
					</legend>
					<span style="display: flex">

					</span>
				</fieldset>
			`);

			let elButtonContainer = elFieldset.find("span");
			for(let elButton of elButtons){
				elButtonContainer.append(elButton);
			}

			elButtonContainer.find("label").each( (index, value) => {
				$(value).css("margin", "0px");
				$(value).css("border-radius", "0px");
				$(value).css("border", "1px solid black");
				$(value).css("border-left", "none");
			});
			elButtonContainer.find("label:first").each( (index, value) => {
				$(value).css("border-radius", "4px 0px 0px 4px");

			});
			elButtonContainer.find("label:last").each( (index, value) => {
				$(value).css("border-radius", "0px 4px 4px 0px");
				$(value).css("border-left", "none");
			});

			elGroup.empty();
			elGroup.append(elFieldset);



		}
	});
})(jQuery);
