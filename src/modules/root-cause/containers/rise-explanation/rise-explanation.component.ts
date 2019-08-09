import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ImageHelperService } from '@core/services/image-helper.service';
import { DialogService } from '@dialog/dialog.service';
import { ExplanationJob, Explanation } from '@rootcause/models';
import { ModelVersion } from '@shared/_index';
import { ReqstoreEntry } from '@shared/models/reqstore.model';
import { getFiledNameByTensorDataType } from '@shared/utils/field-name-by-tensor-data-type';
import { flatArray } from '@shared/utils/flat-array';
import { fromSnakeToCamel } from '@shared/utils/from-snake-to-camel';
import * as colorScale from 'd3-scale-chromatic';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

type RiseExplanations = Array<{
  mask: number[];
  class: number;
  probability: number;
  color: string;
}>;

@Component({
  selector: 'hs-rise-explanation',
  templateUrl: './rise-explanation.component.html',
  styleUrls: ['./rise-explanation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiseExplanationComponent implements OnInit {
  imageWidth: number;
  imageHeight: number;
  originalImage: number[];

  showMore$: BehaviorSubject<any> = new BehaviorSubject('');
  showedExplanations$: Observable<RiseExplanations> = this.showMore$.pipe(
    scan(showed => {
      const STEP = 5;
      const accLength = showed.length;
      const res = [
        ...showed,
        ...this.explanations.slice(accLength, accLength + STEP),
      ];
      return res;
    }, [])
  );

  // probs: number[];
  // masks: number[][];
  // job: ExplanationJob;
  explanations: RiseExplanations;

  @Input() reqstoreEntry: ReqstoreEntry;
  @Input() modelVersion: ModelVersion;
  @Input() set explanationJob(job: ExplanationJob) {
    this.explanations = (job.explanation.result as RiseExplanations)
      .map(item => ({
        ...item,
        color: colorScale.interpolateBlues(
          item.probability < 0.15 ? 0.15 : item.probability
        ),
      }))
      .sort((a, b) => b.probability - a.probability);

  }

  constructor(
    private imageHelper: ImageHelperService,
    private dialog: DialogService
  ) {}

  ngOnInit() {
    this.setWidthHeightForImages();
  }

  // get result() {
  //   try {
  //     if (this.probs) {
  //       return this.probs;
  //     }
  //     const probs = this.getValue(
  //       this.reqstoreEntry.response.outputs.probabilities
  //     )
  //       .map((value, idx) => ({
  //         class: idx,
  //         value,
  //         color: colorScale.interpolateBlues(value < 0.15 ? 0.15 : value),
  //       }))
  //       .sort((a, b) => b.value - a.value);

  //     this.probs = probs;
  //     return probs;
  //   } catch {
  //     console.warn(`outputs doesn't have probability field`);
  //     return [];
  //   }
  // }

  // get explanation(): Explanation {
  //   return this.job.explanation;
  // }

  // get probabilities(): number[] {
  //   try {
  //     if (this.probs) {
  //       return this.probs;
  //     }
  //     const probs = this.getValue(
  //       this.reqstoreEntry.response.outputs.probabilities
  //     )
  //       .map((value, idx) => ({
  //         class: idx,
  //         value,
  //         color: colorScale.interpolateBlues(value < 0.15 ? 0.15 : value),
  //       }))
  //       .sort((a, b) => b.value - a.value);

  //     this.probs = probs;
  //     return probs;
  //   } catch {
  //     console.warn(`outputs doesn't have probability field`);
  //     return [];
  //   }
  // }

  showMore() {
    this.showMore$.next('');
  }

  setWidthHeightForImages(): void {
    try {
      const imageField = this.modelVersion.modelContract.predict.inputs.find(
        p => p.profile === 'IMAGE'
      );
      const tensorProto = this.reqstoreEntry.request.inputs[imageField.name];
      const pixels = this.getValue(tensorProto);

      const dim = tensorProto.tensorShape.dim;
      const [, imageWidth, imageHeight] = dim;
      this.imageWidth = imageWidth.size;
      this.imageHeight = imageHeight.size;

      this.originalImage = this.imageHelper.transformToRGBA({
        pixels,
        imageHeight: this.imageWidth,
        imageWidth: this.imageHeight,
      });
    } catch {
      console.warn(`input doesn't have any IMAGE`);
    }
  }

  // get masksPixelsArray() {
  //   try {
  //     return JSON.parse(this.explanation.result.masks).map(pixels => {
  //       return this.imageHelper.transformToRGBA({
  //         pixels: flatArray(pixels),
  //         imageHeight: this.imageHeight,
  //         imageWidth: this.imageWidth,
  //         colormap: 'coldwarm',
  //       });
  //     });
  //   } catch {
  //     return [];
  //   }
  // }

  getPixels(arr: any): number[] {
    // TODO: remove flat! low perf
    return this.imageHelper.transformToRGBA({
      pixels: _.flattenDeep(arr),
      imageHeight: this.imageHeight,
      imageWidth: this.imageWidth,
      colormap: 'coldwarm',
    });
  }

  isImage(inputName: string): boolean {
    const isImage = this.modelVersion.modelContract.predict.inputs.some(
      p => p.name === inputName && p.profile === 'IMAGE'
    );
    return isImage;
  }

  getValueAsText(tensorProto): any {
    const field = fromSnakeToCamel(
      getFiledNameByTensorDataType(tensorProto.dtype)
    );
    const data = tensorProto[field];
    try {
      return data.join(', ');
    } catch {
      return data;
    }
  }

  showAsList(name: string) {
    if (name === 'probabilities') {
      return true;
    }
    return false;
  }

  onClose(): void {
    this.dialog.closeDialog();
  }

  private getValue(tensorProto): any {
    const field = fromSnakeToCamel(
      getFiledNameByTensorDataType(tensorProto.dtype)
    );
    const data = tensorProto[field];
    return data;
  }
}
