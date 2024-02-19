import React from "react";
import LoadReport from "./loadReport";
import AnnotationBox from "./Annotations";
import { AnnotationProvider } from "./AnnotationContext";
export default function Report() {
      return (
        <div>
        <AnnotationProvider>
          <LoadReport/>
          <AnnotationBox/>
        </AnnotationProvider>
        </div>
      );
} 