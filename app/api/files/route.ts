import { NextResponse } from 'next/server';
import minioClient, { BUCKET_NAME } from '@/lib/minio-client';

interface FileInfo {
    name: string;
    size: number;
    lastModified: Date;
}

export async function GET() {
    try {
        const objects: FileInfo[] = [];
        const stream = minioClient.listObjects(BUCKET_NAME, '', true);

        for await (const obj of stream) {
            if (obj.name) {
                const stat = await minioClient.statObject(BUCKET_NAME, obj.name);
                objects.push({
                    name: obj.name,
                    size: stat.size,
                    lastModified: stat.lastModified
                });
            }
        }

        return NextResponse.json({ files: objects });
    } catch (error) {
        console.error('List files error:', error);
        return NextResponse.json(
            { error: 'Error listing files' },
            { status: 500 }
        );
    }
}
