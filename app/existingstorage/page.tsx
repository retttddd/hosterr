'use client';
import React from "react";

class FileInfo {
    constructor(public name: string, public size: number, public lastModified: Date) {}
}

export default function Storages() {
    const [files, setFiles] = React.useState<FileInfo[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/files');
            const data = await response.json();
            if (data.files) {
                setFiles(data.files);
            }
        } catch (err) {
            setError('Error fetching files');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchFiles();
    }, []);


    return (
        <div>
            {files.map((file) => (
                <li
                    key={file.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
                >
                    <span>{file.name}</span>
                </li>
            ))}
        </div>
    );
}
