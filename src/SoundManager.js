import * as THREE from 'three';

/**
 * SoundManager class for managing sounds in a Three.js application.
 */
export class SoundManager {
    /**
     * Creates an instance of SoundManager.
     * @param {THREE.AudioListener} listener - The audio listener used for spatial audio.
     */
    constructor(listener) {
        this.audioLoader = new THREE.AudioLoader();
        this.listener = listener;
        this.sounds = {};
        this.backgroundMusic = {};
    }

    /**
     * Loads a sound from the specified URL.
     * @param {string} name - The name of the sound.
     * @param {string} url - The URL of the sound file.
     * @param {Object} [options] - Optional parameters for the sound.
     * @param {boolean} [options.loop=false] - Whether the sound should loop.
     * @param {number} [options.volume=1] - The volume of the sound (0 to 1).
     * @returns {Promise<THREE.Audio>} A promise that resolves with the loaded sound.
     */
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

    /**
     * Plays the specified sound.
     * @param {string} name - The name of the sound to play.
     */
    playSound(name) {
        if (this.sounds[name] && !this.sounds[name].isPlaying) {
            this.sounds[name].play();
        }
    }

    /**
     * Stops the specified sound.
     * @param {string} name - The name of the sound to stop.
     */
    stopSound(name) {
        if (this.sounds[name] && this.sounds[name].isPlaying) {
            this.sounds[name].stop();
        }
    }

    /**
     * Stops all currently playing sounds.
     */
    stopAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            if (sound.isPlaying) {
                sound.stop();
            }
        });
    }
}
