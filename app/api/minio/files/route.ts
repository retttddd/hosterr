import { NextResponse } from 'next/server';
import minioClient from '@/lib/features/minio/minio-client';

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

        const objects: FileInfo[] = [];
        const stream = minioClient.listObjects(name, '', true);

        for await (const obj of stream) {
            if (obj.name) {
                const stat = await minioClient.statObject(name, obj.name);
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
