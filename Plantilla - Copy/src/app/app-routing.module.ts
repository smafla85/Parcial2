// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';

const routes: Routes = [
  {
    path: '', //url
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/ui-component/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/ui-component/ui-color/ui-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      },
      {
        path: 'proveedores',
        loadComponent: () => import('./proveedores/proveedores.component').then((m) => m.ProveedoresComponent)
      },
      {
        path: 'nuevoproveedor',
        loadComponent: () => import('./proveedores/nuevoproveedor/nuevoproveedor.component').then((m) => m.NuevoproveedorComponent)
      },
      {
        path: 'editarproveedor/:id',
        loadComponent: () => import('./proveedores/nuevoproveedor/nuevoproveedor.component').then((m) => m.NuevoproveedorComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./clientes/clientes.component').then((m) => m.ClientesComponent)
      },
      {
        path: 'nuevocliente',
        loadComponent: () => import('./clientes/nuevocliente/nuevocliente.component').then((m) => m.NuevoclienteComponent)
      },
      {
        path: 'editarcliente/:idCliente',
        loadComponent: () => import('./clientes/nuevocliente/nuevocliente.component').then((m) => m.NuevoclienteComponent)
      },
      {
        path: 'editarfactura/:id',
        loadComponent: () => import('./facturas/nuevafactura/nuevafactura.component').then((m) => m.NuevafacturaComponent)
      },
      {
        path: 'nuevafactura',
        loadComponent: () => import('./facturas/nuevafactura/nuevafactura.component').then((m) => m.NuevafacturaComponent)
      },
      {
        path: 'facturas',
        loadComponent: () => import('./facturas/facturas.component').then((m) => m.FacturasComponent)
      },
      {
        path: 'empleados',
        loadComponent: () => import('./empleados/empleados.component').then((m) => m.EmpleadosComponent)
      },
      {
        path: 'nuevoempleado',
        loadComponent: () => import('./empleados/nuevoempleado/nuevoempleado.component').then((m) => m.NuevoempleadoComponent)
      },
      {
        path: 'editarempleado/:id',
        loadComponent: () => import('./empleados/nuevoempleado/nuevoempleado.component').then((m) => m.NuevoempleadoComponent)
      },

      // Nuevas rutas para departamentos
      {
        path: 'departamentos',
        loadComponent: () => import('./departamentos/departamentos.component').then((m) => m.DepartamentosComponent)
      },
      {
        path: 'nuevodepartamento',
        loadComponent: () => import('./departamentos/nuevodepartamento/nuevodepartamento.component').then((m) => m.NuevodepartamentoComponent)
      },
      {
        path: 'editardepartamento/:id',
        loadComponent: () => import('./departamentos/nuevodepartamento/nuevodepartamento.component').then((m) => m.NuevodepartamentoComponent)
      },
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/authentication/login/login.component')
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
