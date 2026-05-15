// Apple Vision OCR — prend une image en argument, écrit le texte sur stdout
// Compilation : swiftc ocr.swift -o ocr
// Usage : ./ocr <image.png> [lang1,lang2,...]  (ex: ./ocr p.png fr-FR,ar-SA)

import Foundation
import Vision
import AppKit

let args = CommandLine.arguments
guard args.count >= 2 else {
    FileHandle.standardError.write("Usage: ocr <image> [fr-FR,ar-SA]\n".data(using: .utf8)!)
    exit(1)
}
let imagePath = args[1]
let langs = (args.count >= 3 ? args[2] : "fr-FR,ar-SA").split(separator: ",").map(String.init)

guard let nsImg = NSImage(contentsOfFile: imagePath),
      let cgImg = nsImg.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    FileHandle.standardError.write("Cannot load image\n".data(using: .utf8)!)
    exit(2)
}

let req = VNRecognizeTextRequest { (request, err) in
    guard let obs = request.results as? [VNRecognizedTextObservation] else { return }
    for o in obs {
        if let top = o.topCandidates(1).first {
            print(top.string)
        }
    }
}
req.recognitionLevel = .accurate
req.recognitionLanguages = langs
req.usesLanguageCorrection = true

let handler = VNImageRequestHandler(cgImage: cgImg, options: [:])
do {
    try handler.perform([req])
} catch {
    FileHandle.standardError.write("OCR error: \(error)\n".data(using: .utf8)!)
    exit(3)
}
