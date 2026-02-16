import { NextResponse } from 'next/server';
import minioClient, { ensureBucketExists, resolveBucketName } from '@/lib/features/minio/minio-client';

interface FileInfo {
    name: string;
    size: number;
    lastModified: Date;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');
        if (!name) return NextResponse.json({ error: 'No name provided' }, { status: 400 });
        const bucketName = resolveBucketName(name);

        await ensureBucketExists(bucketName);

        const objects: FileInfo[] = [];
        const stream = minioClient.listObjects(bucketName, '', true);

        for await (const obj of stream) {
            if (obj.name) {
                const stat = await minioClient.statObject(bucketName, obj.name);
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
