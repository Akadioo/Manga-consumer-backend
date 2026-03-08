import { PartialType } from '@nestjs/swagger';
import { CreatePreferenceDto } from './create-mercadopago.dto';

export class UpdateMercadopagoDto extends PartialType(CreatePreferenceDto) {}
