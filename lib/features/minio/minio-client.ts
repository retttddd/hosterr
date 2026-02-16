import * as Minio from 'minio';

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

export const DEFAULT_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'default-storage';

const normalizeBucketName = (value: string) => {
    const normalized = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

    let candidate = normalized || DEFAULT_BUCKET_NAME;
    if (candidate.length < 3) {
        candidate = `${candidate}-storage`;
    }
    candidate = candidate.slice(0, 63).replace(/^-+|-+$/g, '');

    if (!candidate) {
        return DEFAULT_BUCKET_NAME;
    }
    if (!/^[a-z0-9]/.test(candidate)) {
        candidate = `a${candidate}`.slice(0, 63);
    }
    if (!/[a-z0-9]$/.test(candidate)) {
        candidate = `${candidate}0`.slice(0, 63);
    }

    return candidate;
};

export const resolveBucketName = (value?: string | null) => {
    if (!value) return DEFAULT_BUCKET_NAME;
    return normalizeBucketName(value);
};

export const ensureBucketExists = async (bucketName: string) => {
    const BUCKET_NAME = resolveBucketName(bucketName);
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
        await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
    }
};

export const initializeBucket = async (bucketName = DEFAULT_BUCKET_NAME) => {
    await ensureBucketExists(bucketName);
};

export default minioClient;
