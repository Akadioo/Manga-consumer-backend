import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  private readonly logger = new Logger(ResendService.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.from =
      this.configService.get<string>('RESEND_FROM') ??
      'no-reply@manganostore.cl';

    if (!apiKey) {
      throw new Error('Falta RESEND_API_KEY en tu archivo .env');
    }

    this.resend = new Resend(apiKey);
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Error enviando correo a ${to}: ${error.message}`);
        throw error;
      }

      this.logger.log(`Correo enviado correctamente a ${to}`);
      return data;
    } catch (err) {
      this.logger.error(`Fallo al enviar correo: ${err.message}`);
      throw err;
    }
  }

  async sendRecoveryEmail(email: string, tempPassword: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #111">
        <h2>Recuperación de contraseña</h2>
        <p>Hola, hemos generado una nueva contraseña temporal para ti:</p>
        <p style="font-size: 1.2em; background: #f3f3f3; padding: 8px 12px; border-radius: 8px; display:inline-block;">
          <b>${tempPassword}</b>
        </p>
        <p>Inicia sesión con esta contraseña temporal y luego podrás cambiarla en tu perfil.</p>
        <p>Atentamente,<br><b>Equipo MangaNoStore</b></p>
      </div>
    `;

    return this.sendMail(email, 'Tu nueva contraseña temporal', html);
  }
}
