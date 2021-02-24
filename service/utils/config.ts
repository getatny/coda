import path from 'path';
import fse from 'fs-extra';

export default {
    configPath: path.resolve(__dirname, '..', 'configs/config.json'),

    getConfig(key) {
        let config = fse.readJsonSync(this.configPath);
        const keys = key.split('.');

        for (let i = 0; i < keys.length; i += 1) {
            config = config[keys[i]];
        }

        return config;
    },

    getConfigs() {
        return fse.readJsonSync(this.configPath);
    },

    setConfig(key, value) {
        try {
            const config = fse.readJsonSync(this.configPath);
            const keys = key.split('.');
            let command = 'config';

            for (let i = 0; i < keys.length; i += 1) {
                // eslint-disable-next-line no-param-reassign
                value += `[${keys[i]}]`;
            }

            command += ` + ${value}`;
            // eslint-disable-next-line no-eval
            eval(command);

            fse.writeJsonSync(this.configPath, config, {
                spaces: '\t',
            });

            return true;
        } catch (err) {
            return false;
        }
    },

    setConfigs(configs) {
        try {
            const originConfigs = this.getConfigs();
            fse.writeJsonSync(this.configPath, {
                ...originConfigs,
                ...configs,
            }, {
                replacer: '  ',
            });

            return true;
        } catch {
            return false;
        }
    },
};
