import { NextRequest, NextResponse } from 'next/server';
import minioClient, { ensureBucketExists, resolveBucketName } from '@/lib/features/minio/minio-client';

export async function GET(
    request: NextRequest,
    { params }: { params: { filename?: string[] | string } }
) {
    try {
        const storageName = request.headers.get('x-storage-name');

        if (!storageName) {
            return NextResponse.json(
                { error: 'Missing storage name header' },
                { status: 400 }
            );
        }

        const bucketName = resolveBucketName(storageName);
        await ensureBucketExists(bucketName);
        const fromParams = Array.isArray(params?.filename)
            ? params.filename
            : typeof params?.filename === 'string'
                ? [params.filename]
                : [];

        const fromPathname = request.nextUrl.pathname
            .replace(/^\/api\/minio\/download\/?/, '')
            .split('/')
            .filter(Boolean);

        const filenameParts = (fromParams.length > 0 ? fromParams : fromPathname)
            .map((part) => decodeURIComponent(part));

        if (filenameParts.length === 0) {
            return NextResponse.json(
                { error: 'Missing filename' },
                { status: 400 }
            );
        }

        const objectKey = filenameParts.join('/');

        const objectStream = await minioClient.getObject(bucketName, objectKey);

        const chunks: Buffer[] = [];
        for await (const chunk of objectStream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }

        const buffer = Buffer.concat(chunks);

        const stat = await minioClient.statObject(bucketName, objectKey);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': stat.metaData?.['content-type'] || 'application/octet-stream',
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        const message = error instanceof Error ? error.message : 'Error downloading file';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
