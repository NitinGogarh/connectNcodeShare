export const LANG: Array<string> = [
    "Cpp",
  "Python",

  "Javascript",
 
  "Java",
];
export const newMap = new Map([
    ["Python", "3.10.0"],
    ["Typescript", "1.32.3"],
    ["Javascript", "1.32.3"],
    ["Cpp", "10.2.0"],
    ["Java", "15.0.2"]
  ]);


type Tsneppets<T> = {
    [key:string]:T,
    Javascript:T,
    Typescript:T,
    Cpp:T,
    Java:T,
    Python:T
}
export const codeSnippets:Tsneppets<string> = {
  Javascript: "console.log('Hello, world!');",
  Typescript: `
  function add(x: number, y: number): number {
    return x + y;
  }
  
  console.log(add(5, 3)); // Output: 8
  `,
  Cpp: `
  #include <iostream>
  
  int main() {
    std::cout << "Hello, world!" << std::endl;
    return 0;
  }
  `,
  Java: `
  public class Greeter {
  
    public static void main(String[] args) {
      System.out.println("Hello, world!");
    }
  }
  `,
  Python: "print('Hello, world!')",
};
