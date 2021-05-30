import { Module } from "@nestjs/common";
import { Route, RouterModule } from "nest-router";
import {
  CompanyModule,
  SegmentModule,
  ConfirmSetModule,
  ConfirmSegmentModule,
  ConfirmContactModule,
  RoleModule,
  InternalContactModule,
  PingMoudle,
  DeviationModule,
  SecurityContractModule,
} from ".";
import { CertificateModule } from "./certificate.module";
import { ImageModule } from "./image.module";
import { InternalSyncModule } from "./internal-sync.module";

const routes: Route[] = [
  {
    path: '/company',
    module: CompanyModule,
  },
  {
    path:'/security-contract',
    module: SecurityContractModule,
  },
  {
    path: '/segment',
    module: SegmentModule,
  },
  {
    path: '/confirm-set',
    module: ConfirmSetModule,
    children: [
      {
        path: ':confirmSetId/segment',
        module: ConfirmSegmentModule,
      },
      {
        path: ':confirmSetId/contact',
        module: ConfirmContactModule,
      },
      {
        path: ':confirmSetId/deviation',
        module: DeviationModule,
      }
    ],
  },
  {
    path: '/certificate',
    module: CertificateModule,
  },
  {
    path: '/role',
    module: RoleModule,
  },
  {
    path: '/image',
    module: ImageModule
  },
  {
    path: '/internal-contact',
    module: InternalContactModule,
  },
  {
    path: '/internal-sync',
    module: InternalSyncModule,
  },
  {
    path: '/ping',
    module: PingMoudle
  }
];

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    CompanyModule,
    SecurityContractModule,
    SegmentModule,
    ConfirmSetModule,
    ConfirmSegmentModule,
    ConfirmContactModule,
    InternalContactModule,
    RoleModule,
    CertificateModule,
    ImageModule,
    InternalSyncModule,
    DeviationModule,
    PingMoudle,
  ],
})
export class RoutingModule { }