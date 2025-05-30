import EventEmitter from './EventEmitter.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default class Resources extends EventEmitter {
    constructor() {
        super()

        this.setLoaders()

        this.toLoad = 0
        this.loaded = 0
        this.items = {}
    }

    setLoaders() {
        this.loaders = []

        // Images
        this.loaders.push({
            extensions: ['jpg', 'png'],
            action: (_resource) => {
                const image = new Image()

                image.addEventListener('load', () => {
                    console.log(`✅ Loaded image: ${_resource.name}`);
                    this.fileLoadEnd(_resource, image)
                })

                image.addEventListener('error', (e) => {
                    console.error(`❌ Failed to load image: ${_resource.name} (${_resource.source})`, e);
                    this.fileLoadEnd(_resource, null)
                })

                image.src = _resource.source
            }
        })

        // Draco
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('draco/')
        dracoLoader.setDecoderConfig({ type: 'js' })

        this.loaders.push({
            extensions: ['drc'],
            action: (_resource) => {
                dracoLoader.load(
                    _resource.source,
                    (_data) => {
                        console.log(`✅ Loaded DRACO: ${_resource.name}`);
                        this.fileLoadEnd(_resource, _data)
                        DRACOLoader.releaseDecoderModule()
                    },
                    undefined,
                    (error) => {
                        console.error(`❌ Failed to load DRACO: ${_resource.name} (${_resource.source})`, error)
                        this.fileLoadEnd(_resource, null)
                    }
                )
            }
        })

        // GLTF
        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)

        this.loaders.push({
            extensions: ['glb', 'gltf'],
            action: (_resource) => {
                gltfLoader.load(
                    _resource.source,
                    (_data) => {
                        console.log(`✅ Loaded GLTF: ${_resource.name}`);
                        this.fileLoadEnd(_resource, _data)
                    },
                    undefined,
                    (error) => {
                        console.error(`❌ Failed to load GLTF: ${_resource.name} (${_resource.source})`, error)
                        this.fileLoadEnd(_resource, null)
                    }
                )
            }
        })

        // FBX
        const fbxLoader = new FBXLoader()

        this.loaders.push({
            extensions: ['fbx'],
            action: (_resource) => {
                fbxLoader.load(
                    _resource.source,
                    (_data) => {
                        console.log(`✅ Loaded FBX: ${_resource.name}`);
                        this.fileLoadEnd(_resource, _data)
                    },
                    undefined,
                    (error) => {
                        console.error(`❌ Failed to load FBX: ${_resource.name} (${_resource.source})`, error)
                        this.fileLoadEnd(_resource, null)
                    }
                )
            }
        })
    }

    load(_resources = []) {
        for (const _resource of _resources) {
            this.toLoad++

            if (_resource.source.startsWith('data:')) {
                console.warn(`⚠️ Skipping data URL resource: ${_resource.name}`);
                this.fileLoadEnd(_resource, null)
                continue
            }

            const extensionMatch = _resource.source.match(/\.([a-z]+)$/)

            if (extensionMatch?.[1]) {
                const extension = extensionMatch[1]
                const loader = this.loaders.find((_loader) =>
                    _loader.extensions.includes(extension)
                )

                if (loader) {
                    loader.action(_resource)
                } else {
                    console.error(`❌ No loader found for: ${_resource.name} (extension .${extension})`)
                }
            } else {
                console.error(`❌ Could not extract file extension: ${_resource.name} (source: ${_resource.source})`)
                this.fileLoadEnd(_resource, null)
            }
        }
    }

    fileLoadEnd(_resource, _data) {
        if (_data === null) {
            console.warn(`⚠️ Load failed for: ${_resource.name}`)
        } else {
            console.log(`📦 Loaded: ${_resource.name}`)
        }

        this.loaded++
        this.items[_resource.name] = _data

        this.trigger('fileEnd', [_resource, _data])

        if (this.loaded === this.toLoad) {
            this.trigger('end')
        }
    }
}
