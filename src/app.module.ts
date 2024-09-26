import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceiptsController } from './receipts/receipts.controller';
import { ReceiptsModule } from './receipts/receipts.module';
import { ReceiptsService } from './receipts/receipts.service';

@Module({
  imports: [ReceiptsModule],
  controllers: [AppController, ReceiptsController],
  providers: [AppService, ReceiptsService],
})
export class AppModule {}
