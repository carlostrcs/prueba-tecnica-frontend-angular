import { test, expect } from '@playwright/test';

test.describe('Users Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('should show users table', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible()
    const headers = page.locator('th');
    await expect(headers).toHaveCount(5);
    await expect(headers.nth(0)).toHaveText('Imagen');
    await expect(headers.nth(1)).toHaveText('Nombre Completo');
    await expect(headers.nth(2)).toHaveText('Email');
    await expect(headers.nth(3)).toHaveText('País');
    await expect(headers.nth(4)).toHaveText('Acciones');
  });

  test('should add new user', async ({ page }) => {
    await page.click('text=Añadir');
    const modal = page.getByTestId('userModal');
    await expect(modal).toBeVisible();

    await page.fill('input[formControlName="firstName"]', 'John');
    await page.fill('input[formControlName="lastName"]', 'Doe');
    await page.fill('input[formControlName="email"]', 'john.doe@example.com');
    await page.fill('input[formControlName="country"]', 'España');

    await page.click('text=Guardar');
    await expect(modal).not.toBeVisible();

    const userRow = page.locator('tr', { hasText: 'John Doe' });
    await expect(userRow).toBeVisible();
    await expect(userRow).toContainText('john.doe@example.com');
    await expect(userRow).toContainText('España');
  });

  test('should edit user', async ({ page }) => {
    await page.waitForSelector('tr');

    // Clic en el botón editar del primer usuario
    await page.click('tr >> nth=1 >> text=Editar');


    const modal = page.getByTestId('userModal');
    await expect(modal).toBeVisible();
    await page.fill('input[formControlName="firstName"]', 'Jane');
    await page.fill('input[formControlName="email"]', 'jane.doe@example.com');

    await page.click('text=Actualizar');
    await expect(modal).not.toBeVisible();

    const userRow = page.locator('tr', { hasText: 'Jane' });
    await expect(userRow).toBeVisible();
    await expect(userRow).toContainText('jane.doe@example.com');
  });

  test('should delete user', async ({ page }) => {
    await page.waitForSelector('td');
    const initialCount = await page.locator('tr').count();

    // Clic en el botón eliminar del primer usuario
    await page.click('tr >> nth=1 >> text=Eliminar');

    await expect(page.locator('tr')).toHaveCount(initialCount - 1);
  });

  test('should restore users list', async ({ page }) => {
    await page.waitForSelector('td');
    const initialCount = await page.locator('tr').count();

    // Clic en el botón eliminar del primer usuario
    await page.click('tr >> nth=1 >> text=Eliminar');

    await expect(page.locator('tr')).toHaveCount(initialCount - 1);
    await page.click('text=Restaurar');
    await expect(page.locator('tr')).toHaveCount(initialCount);
  });

  test('should validate form fields', async ({ page }) => {
    // Abrir modal
    await page.click('text=Añadir');

    // Verificar que el modal está visible
    await expect(page.locator('[data-testid="userModal"]')).toBeVisible();

    // Dejar todos los campos touched
    for (const field of ['firstName', 'lastName', 'email', 'country']) {
      await page.click(`input[formControlName="${field}"]`);
      await page.keyboard.press('Tab');
    }

    // Verificar que aparecen todos los mensajes de error
    await expect(page.locator('text=El nombre es requerido')).toBeVisible();
    await expect(page.locator('text=El apellido es requerido')).toBeVisible();
    await expect(page.locator('text=Introduce un email válido')).toBeVisible();
    await expect(page.locator('text=El país es requerido')).toBeVisible();

    // Verificar que el botón guardar está deshabilitado
    const submitButton = page.locator('button:text("Guardar")');
    await expect(submitButton).toBeDisabled();

    // Rellenar el formulario con email inválido
    await page.fill('input[formControlName="firstName"]', 'John');
    await page.fill('input[formControlName="lastName"]', 'Doe');
    await page.fill('input[formControlName="email"]', 'invalid-email');
    await page.fill('input[formControlName="country"]', 'España');

    // Verificar que el botón guardar está deshabilitado
    await expect(submitButton).toBeDisabled();
    await expect(page.locator('text=Introduce un email válido')).toBeVisible();

    // Rellenar el formulario con datos válidos
    await page.fill('input[formControlName="firstName"]', 'John');
    await page.fill('input[formControlName="lastName"]', 'Doe');
    await page.fill('input[formControlName="email"]', 'john.doe@example.com');
    await page.fill('input[formControlName="country"]', 'España');

    // El botón debería estar habilitado
    await expect(submitButton).toBeEnabled();

    // Enviar el formulario
    await page.click('button:text("Guardar")');
    await expect(page.locator('[data-testid="userModal"]')).not.toBeVisible();
  });

});
