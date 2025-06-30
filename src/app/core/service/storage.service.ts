import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  /**
   *
   * @param identifier
   * @param value
   * Saves a value to localStorage with the given identifier.
   * The value is stringified before saving.
   */
  save<T>(identifier: string, value: NonNullable<T>) {
    localStorage.setItem(identifier, JSON.stringify(value));
  }

  /**
   *
   * @param identifier
   * Retrieves a value from localStorage by its identifier.
   * If the value is not found or cannot be parsed, it returns null.
   */
  get<T>(identifier: string): T | null {
    const value = localStorage.getItem(identifier);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch (e) {
        console.error(`Error parsing value for ${identifier}:`, e);
        return null;
      }
    }
    return null;
  }

  delete(identifier: string): void {
    localStorage.removeItem(identifier);
  }
}
