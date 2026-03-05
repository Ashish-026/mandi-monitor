const getDbx = () => {
    const token = localStorage.getItem('dropbox_token');
    return token ? new window.Dropbox.Dropbox({ accessToken: token }) : null;
};

export const uploadRecord = async (record) => {
    const dbx = getDbx();
    if (!dbx) return;
    try {
        await dbx.filesUpload({
            path: `/records/rec_${record.id}.json`,
            contents: JSON.stringify(record),
            mode: { '.tag': 'overwrite' }
        });
    } catch (e) { console.error("Upload Error", e); }
};

export const downloadAll = async () => {
    const dbx = getDbx();
    if (!dbx) return [];
    try {
        const list = await dbx.filesListFolder({ path: '/records' });
        const promises = list.result.entries.map(async (file) => {
            const res = await dbx.filesDownload({ path: file.path_lower });
            const text = await res.result.fileBlob.text();
            return JSON.parse(text);
        });
        const results = await Promise.all(promises);
        return results.sort((a, b) => b.id - a.id);
    } catch (e) { 
        console.log("No remote records found");
        return []; 
    }
};
