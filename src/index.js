const axios = require('axios');
const querystring = require('querystring');
const ShortUniqueId = require('short-unique-id');
const { convertTo64 } = require('./utils/base64');
const { SEARCH_URL, CREATE_URL, CREATE_READY_URL } = require('./config/constants');

class PlaygroundAI {
  constructor(opts) {
    this.mode = opts.sessionToken && opts.sessionToken !== '' ? 'token' : 'login';
    this.sessionToken = opts.sessionToken || '';
    this.csrfToken = opts.csrfToken || '';
    this.cookie = `__Secure-next-auth.callback-url=https%3A%2F%2Fplaygroundai.com%2Flogin;__Host-next-auth.csrf-token=${this.csrfToken};__Secure-next-auth.session-token=${this.sessionToken}`;
    this.username = this.mode === 'login' ? opts.username : '';
    this.password = this.mode === 'login' ? opts.password : '';
  }

  async search(prompt) {
    try {
      const _prompt = querystring.escape(prompt);
      const url = `${SEARCH_URL}${_prompt}`;
      const res = await axios.get(url);
      return res.data.pageProps.data;
    } catch (e) {
      return {
        error: e.message
      }
    }
  }

  async create(opts) {
    try {
      if (typeof opts === 'string' && opts === '') return Promise.reject('no prompt provided!');
      if (this.mode === 'token' && (this.sessionToken === '' || this.csrfToken === '')) return Promise.reject('the token login information is invalid');
      if (this.mode === 'login' && (this.username === '' || this.password === '')) return Promise.reject('the login information is invalid');
      
      const headers = {
        Cookie: this.cookie,
      };
      const prompt = typeof opts === 'string' ? opts : opts.prompt;
      
      const uuid = new ShortUniqueId({ length: 10 });
      const batchId = uuid();
      const payload = {
        batchId,
        prompt,
        cfg_scale: opts.cfg_scale || 7,
        dream_booth_model: '',
        generateVariants: opts.generateVariants || false,
        guidance_scale: opts.guidance_scale || 7,
        height: opts.height || 768,
        width: opts.width || 768,
        hide: false,
        isPrivate: false,
        modelType: opts.modelType || 'stable-diffusion-2',
        num_images: opts.num_images || 4,
        sampler: opts.sampler || 2,
        seed: opts.seed || 527825028,
        steps: opts.steps || 25,
        strength: opts.strength || 1.45,
      }
      const info = await axios.post(CREATE_URL, payload, { headers });
      const ready_url = CREATE_READY_URL.replace('**BATCH_ID**', batchId).replace('**SIZE**', opts.num_images || 4);
      const res = await axios.get(ready_url, { headers })
      return res.data;
    } catch (e) {
      return {
        error: e.message
      }
    }
  }

  async modify(opts) {
    try {
      if (!opts.prompt || opts.prompt === '') return Promise.reject('no prompt provided!');
      if (!opts.image || opts.image === '') return Promise.reject('no image provided!');
      if (this.mode === 'token' && (this.sessionToken === '' || this.csrfToken === '')) return Promise.reject('the token login information is invalid');
      if (this.mode === 'login' && (this.username === '' || this.password === '')) return Promise.reject('the login information is invalid');
      
      const headers = {
        Cookie: this.cookie,
      };
      
      const uuid = new ShortUniqueId({ length: 10 });
      const batchId = uuid();
      const image = await convertTo64(opts.image);
      
      const payload = {
        batchId,
        prompt: opts.prompt,
        init_image: `data:image/png;base64,${image}`,
        cfg_scale: opts.cfg_scale || 7,
        dream_booth_model: '',
        generateVariants: opts.generateVariants || false,
        guidance_scale: opts.guidance_scale || 7,
        height: opts.height || 512,
        width: opts.width || 512,
        hide: false,
        isPrivate: false,
        mask_strength: opts.mask_strength || 0.7,
        mode: opts.mode || 2,
        modelType: opts.modelType || 'stable-diffusion-2',
        num_images: 1,
        sampler: opts.sampler || 2,
        seed: opts.seed || 481512883,
        steps: opts.steps || 64,
        strength: opts.strength || 1.45,
      }
      const info = await axios.post(CREATE_URL, payload, { headers });
      const ready_url = CREATE_READY_URL.replace('**BATCH_ID**', batchId).replace('**SIZE**', 1);
      const res = await axios.get(ready_url, { headers })
      return res.data.images[0];
    } catch (e) {
      return {
        error: e.message
      }
    }
  }
}

module.exports = PlaygroundAI;