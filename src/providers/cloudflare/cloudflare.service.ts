import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);
  private readonly s3: S3;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = this.requireEnv('CLOUDFLARE_R2_ACCOUNT_ID');
    const accessKey = this.requireEnv('CLOUDFLARE_R2_ACCESS_KEY_ID');
    const secretKey = this.requireEnv('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    this.bucket = this.requireEnv('CLOUDFLARE_R2_BUCKET');
    this.publicUrl = this.requireEnv('CLOUDFLARE_R2_PUBLIC_URL');

    this.s3 = new S3({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      signatureVersion: 'v4',
      region: 'auto',
    });
  }

  private requireEnv(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) throw new Error(`Falta variable ${key} en .env`);
    return value;
  }

  async uploadFile(
    file: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<string> {
    const cleanFilename = filename.replace(/^\/+/, '').replace(/\s+/g, '-');


    const key = `mangas/${randomUUID()}-${cleanFilename}`;

    await this.s3
      .putObject({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimetype,
      })
      .promise();

    const cleanBase = this.publicUrl.replace(/\/+$/, '');
    const url = `${cleanBase}/${key}`;

    this.logger.log(`Archivo subido a Cloudflare: ${url}`);
    return url;
  }
}
