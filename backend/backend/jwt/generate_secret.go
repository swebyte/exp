package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
)

func generateSecret() string {
	// Generate a 32-byte random secret
	secret := make([]byte, 32)
	_, err := rand.Read(secret)
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(secret)
}

func main() {
	// Generate a secret key
	secret := generateSecret()

	// Store the secret in a file
	file, err := os.Create("secret.key")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	_, err = file.WriteString(secret)
	if err != nil {
		panic(err)
	}

	fmt.Println("Secret key generated and stored in secret.key")
}