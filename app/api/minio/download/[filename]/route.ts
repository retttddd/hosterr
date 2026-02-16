import { NextRequest, NextResponse } from 'next/server';
import minioClient, { DEFAULT_BUCKET_NAME, ensureBucketExists, resolveBucketName } from '@/lib/features/minio/minio-client';

export async function GET(
    request: NextRequest,
    { params }: { params: { filename: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const bucketName = resolveBucketName(searchParams.get('name') || searchParams.get('bucketName') || DEFAULT_BUCKET_NAME);
        await ensureBucketExists(bucketName);

        const filename = params.filename;
        const objectStream = await minioClient.getObject(bucketName, filename);

        const chunks = [];
        for await (const chunk of objectStream) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);

        const stat = await minioClient.statObject(bucketName, filename);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': stat.metaData?.['content-type'] || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: 'Error downloading file' },
            { status: 500 }
        );
    }
}
