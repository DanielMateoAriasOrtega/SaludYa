describe("Validación de paciente", () => {

  test("Correo válido", () => {
    expect("paciente@test.com")
      .toMatch(/\S+@\S+\.\S+/);
  });

  test("Correo inválido", () => {
    expect("correo")
      .not.toMatch(/\S+@\S+\.\S+/);
  });

  test("Nombre obligatorio", () => {
    expect("Juan Perez".length)
      .toBeGreaterThan(0);
  });

});