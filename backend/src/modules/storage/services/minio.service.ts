import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME', 'savitri-uploads');
    this.publicUrl = this.configService.get<string>('MINIO_PUBLIC_URL', `http://localhost:9000/${this.bucketName}`);

    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: Number(this.configService.get<number>('MINIO_PORT', 9000)),
      useSSL: this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin123'),
    });
  }

  async onModuleInit() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket ${this.bucketName} created successfully.`);

        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetBucketLocation', 's3:ListBucket'],
              Resource: [`arn:aws:s3:::${this.bucketName}`],
            },
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
      }
    } catch (err: any) {
      this.logger.warn(`MinIO initialization check: ${err.message}`);
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'products'): Promise<string> {
    const fileExt = file.originalname.split('.').pop() || 'png';
    const sanitizedExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    const uniqueName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${sanitizedExt}`;

    await this.minioClient.putObject(
      this.bucketName,
      uniqueName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    return `${this.publicUrl}/${uniqueName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (!fileUrl.includes(this.bucketName)) return;
      const objectName = fileUrl.split(`${this.bucketName}/`)[1];
      if (objectName) {
        await this.minioClient.removeObject(this.bucketName, objectName);
      }
    } catch (err: any) {
      this.logger.warn(`Failed to delete object from MinIO: ${err.message}`);
    }
  }
}

