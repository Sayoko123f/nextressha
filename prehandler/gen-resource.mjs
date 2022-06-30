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
    pages.sort((a, b) => {
        return naturalSort(a, b);
    });
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

function naturalSort(a, b) {
    var re =
            /(^([+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|^0x[\da-fA-F]+$|\d+)/g,
        sre = /^\s+|\s+$/g, // trim pre-post whitespace
        snre = /\s+/g, // normalize all whitespace to single ' ' character
        dre =
            /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        i = function (s) {
            return (
                (naturalSort.insensitive && ('' + s).toLowerCase()) ||
                '' + s
            ).replace(sre, '');
        },
        // convert all to strings strip whitespace
        x = i(a),
        y = i(b),
        // chunk/tokenize
        xN = x
            .replace(re, '\0$1\0')
            .replace(/\0$/, '')
            .replace(/^\0/, '')
            .split('\0'),
        yN = y
            .replace(re, '\0$1\0')
            .replace(/\0$/, '')
            .replace(/^\0/, '')
            .split('\0'),
        // numeric, hex or date detection
        xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x)),
        yD =
            parseInt(y.match(hre), 16) ||
            (xD && y.match(dre) && Date.parse(y)) ||
            null,
        normChunk = function (s, l) {
            // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
            return (
                ((!s.match(ore) || l == 1) && parseFloat(s)) ||
                s.replace(snre, ' ').replace(sre, '') ||
                0
            );
        },
        oFxNcL,
        oFyNcL;
    // first try and sort Hex codes or Dates
    if (yD) {
        if (xD < yD) {
            return -1;
        } else if (xD > yD) {
            return 1;
        }
    }
    // natural sorting through split numeric strings and default strings
    for (
        var cLoc = 0,
            xNl = xN.length,
            yNl = yN.length,
            numS = Math.max(xNl, yNl);
        cLoc < numS;
        cLoc++
    ) {
        oFxNcL = normChunk(xN[cLoc] || '', xNl);
        oFyNcL = normChunk(yN[cLoc] || '', yNl);
        // handle numeric vs string comparison - number < string - (Kyle Adams)
        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
            return isNaN(oFxNcL) ? 1 : -1;
        }
        // if unicode use locale comparison
        if (/[^\x00-\x80]/.test(oFxNcL + oFyNcL) && oFxNcL.localeCompare) {
            var comp = oFxNcL.localeCompare(oFyNcL);
            return comp / Math.abs(comp);
        }
        if (oFxNcL < oFyNcL) {
            return -1;
        } else if (oFxNcL > oFyNcL) {
            return 1;
        }
    }
}
