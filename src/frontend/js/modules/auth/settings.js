import {  DEFAULT_SETTINGS,  DEFAULT_PROVIDER } from './constants';

function getSettings(type) {
  if (typeof(process.env.AUTH_PROVIDER_SETTINGS) === 'string') {
    try {
      return JSON.parse(process.env.AUTH_PROVIDER_SETTINGS)
    } catch (error) {
      console.log('Cannot get configuration from AUTH_PROVIDER_SETTINGS environment variable');
      throw error;
    }
  }

  return process.env.AUTH_PROVIDER_SETTINGS || DEFAULT_SETTINGS[type];
}

function getProvider() {
  return process.env.AUTH_PROVIDER || DEFAULT_PROVIDER;
}

export {
  getSettings,
  getProvider
};
