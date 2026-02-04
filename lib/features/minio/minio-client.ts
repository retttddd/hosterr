import * as Minio from 'minio';

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

//export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'qweqwe123123';

export const initializeBucket = async (BUCKET_NAME: string) => {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
        await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
    }
};

export default minioClient;
