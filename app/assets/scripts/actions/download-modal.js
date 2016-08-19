import * as actions from './action-types';

// ////////////////////////////////////////////////////////////////
//                         DOWNLOAD MODAL                        //
// ////////////////////////////////////////////////////////////////

export function closeDownloadModal () {
  return {
    type: actions.CLOSE_DOWNLOAD_MODAL
  };
}

export function openDownloadModal (options) {
  return {
    type: actions.OPEN_DOWNLOAD_MODAL,
    options
  };
}
