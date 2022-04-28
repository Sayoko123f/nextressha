import { config } from './config.mjs';
import path from 'path';
import * as pfs from 'fs/promises';

const data = [];

async function findAlbumDir(dirpath) {
    const files = await pfs.readdir(dirpath, { withFileTypes: true });
    if (files.find((e) => e.name === config.metaFilename)) {
        // is album dir
        const meta = await readMeta(dirpath);
        data.push(meta);
    } else {
        // rescursive read subdir
        const subdirs = files.filter((e) => e.isDirectory());
        for (let i = 0; i < subdirs.length; i++) {
            await findAlbumDir(path.join(dirpath, subdirs[i].name));
        }
    }
}

async function readMeta(dirpath) {
    const meta = JSON.parse(
        await pfs.readFile(path.join(dirpath, config.metaFilename))
    );
    const coverPath = `cover${path.extname(meta.coverName)}`;
    const pages = meta.pages.map((e) => e.split('/').pop().split('?')[0]);
    return {
        key: path.relative(config.imgRootDir, dirpath),
        createDate: meta.createDate,
        title: meta.title,
        pagelen: meta.pagelen,
        albumUrl: meta.albumUrl,
        cover: coverPath,
        pages,
    };
}

async function writeData() {
    const output = config.resourceJsonOutputPath;
    const { serverImgBaseURL } = config;
    const res = { imgRootDir: config.imgRootDir, serverImgBaseURL, res: data };
    await pfs.writeFile(output, JSON.stringify(res));
    console.log('written:', output);
}

(async () => {
    await findAlbumDir(config.imgRootDir);
    await writeData();
})();
