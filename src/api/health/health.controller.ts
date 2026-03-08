import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/utils/decorators/public.decorator';

@Public()
@Controller()
export class HealthController {
  @Get(['health', 'ping'])
  getHealth() {
    return {
      status: 'ok',
      service: 'consumer',
      message: 'Consumer service healthy',
    };
    };
  }
}
