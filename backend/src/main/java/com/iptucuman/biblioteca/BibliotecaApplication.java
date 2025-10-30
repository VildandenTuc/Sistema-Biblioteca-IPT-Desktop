package com.iptucuman.biblioteca;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BibliotecaApplication {

	public static void main(String[] args) {
		// Cargar variables de entorno desde archivo .env
		try {
			Dotenv dotenv = Dotenv.configure()
					.directory("./")
					.ignoreIfMissing()
					.load();

			// Establecer variables de entorno del sistema
			dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
			);

			System.out.println("✅ Variables de entorno cargadas desde .env");
		} catch (Exception e) {
			System.out.println("⚠️ No se pudo cargar .env (esto es normal si usas variables del sistema): " + e.getMessage());
		}

		SpringApplication.run(BibliotecaApplication.class, args);
	}

}
