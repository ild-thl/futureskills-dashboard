import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Objects, Permissions } from 'src/app/core/models/permissions';
import { PermissionService } from 'src/app/core/services/permissions/permission.service';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/auth/auth.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Directive({ selector: 'fs-if-allowed, [fs-if-allowed]' })
export class CheckPermissionsDirective implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input('fs-if-allowed') permission: Permissions;
  @Input('fs-if-allowedObject') object: Objects;

  authSubsciption: Subscription;

  ngOnInit(): void {
    this.checkPermission();
  }
  ngOnDestroy(): void {
    if (this.authSubsciption) this.authSubsciption.unsubscribe();
  }

  checkPermission() {
    this.authSubsciption = this.authService.user$.pipe(take(1)).subscribe((user: User) => {
      if (!!user && this.permissionService.checkPermission(user, this.object, this.permission)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
