import * as THREE from 'three';

export class SoundManager {
    constructor(listener) {
        this.audioLoader = new THREE.AudioLoader();
        this.listener = listener;
        this.sounds = {};
        this.backgroundMusic = {};
    }

    loadSound(name, url, options = { loop: false, volume: 1 }) {
        return new Promise((resolve) => {
            this.audioLoader.load(url, (buffer) => {
                const sound = new THREE.Audio(this.listener);
                sound.setBuffer(buffer);
                sound.setLoop(options.loop);
                sound.setVolume(options.volume);
                this.sounds[name] = sound;
                resolve(sound);
            });
        });
    }

    playSound(name) {
        if (this.sounds[name] && !this.sounds[name].isPlaying) {
            this.sounds[name].play();
        }
    }

    stopSound(name) {
        if (this.sounds[name] && this.sounds[name].isPlaying) {
            this.sounds[name].stop();
        }
    }

    stopAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            if (sound.isPlaying) {
                sound.stop();
            }
        });
    }
}
