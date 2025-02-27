import sharpImageService from 'astro/assets/services/sharp';
 
const MAX_WIDTH = 400;
let sharp;
 
async function loadSharp() {
    let sharpImport;
    try {
        sharpImport = (await import('sharp')).default;
    } catch {
        throw new Error('AstroErrorData.MissingSharp in image-service');
    }
    sharpImport.cache(false);
    return sharpImport;
}
 
export const imageServiceConfig = () => ({
    entrypoint: 'src/services/image-service',
    config: {},
});
 
const transform = async (inputBuffer, transformOptions, config) => {
    if (!sharp) sharp = await loadSharp();
 
    const result = sharp(inputBuffer, {
        failOnError: false,
        pages: -1,
        limitInputPixels: config.service.config.limitInputPixels,
    });
 
    result.rotate();
 
    const metadata = await result.metadata()
 
    if (transformOptions.height && !transformOptions.width) {
        result.resize({ height: Math.round(transformOptions.height) });
    } else if (transformOptions.width) {
        result.resize({ width: Math.round(transformOptions.width) });
    } else if (metadata.width > MAX_WIDTH) {
        result.resize({ width: Math.round(MAX_WIDTH) });
    }
 
    if (transformOptions.format) {
        result.toFormat(transformOptions.format, { quality: undefined });
    }
 
    const { data, info } = await result.toBuffer({
        resolveWithObject: true,
    });
 
    return {
        data,
        format: info.format,
    };
};
 
const imageService = {
    validateOptions: sharpImageService.validateOptions,
    getURL: sharpImageService.getURL,
    parseURL: sharpImageService.parseURL,
    getHTMLAttributes: sharpImageService.getHTMLAttributes,
    transform,
};
 
export default imageService;