import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  NgZone,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

// SERVICE
import { GlobalService } from '@services';

// PACKAGE
import * as _ from 'lodash';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import * as THREE from 'three';
// import * as anime from 'animejs';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-example-page',
  templateUrl: './example-page.component.html',
  styleUrls: ['./example-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamplePageComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb!: any[];

  // Variable
  @ViewChild('canvas') canvasReference!: ElementRef;
  get canvas(): HTMLCanvasElement {
    return this.canvasReference.nativeElement;
  }

  @ViewChild('span') spanReference!: ElementRef;
  get span(): HTMLElement {
    return this.spanReference.nativeElement;
  }

  @ViewChild('content') contentReference!: ElementRef;
  get content(): HTMLElement {
    return this.contentReference.nativeElement;
  }

  scene!: any;
  renderer!: any;
  camera!: any;
  cube!: any;

  event = {
    y: 0,
    deltaY: 0,
  };
  percentage = 0;
  maxHeight = 0;

  startTime = Date.now();
  timeline!: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private readonly zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private translateService: TranslateService
  ) {
    this.settingsAll();

    this.translateService.onLangChange.subscribe((event) => {
      this.settingsAll();
    });
  }

  @HostListener('mousewheel', ['$event']) public onMousewheel(e: any): void {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    const evt = this.event;
    evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
    evt.deltaY *= 0.5;

    if (evt.y + evt.deltaY > 0) {
      evt.y = 0;
    } else if (-(evt.y + evt.deltaY) >= this.maxHeight) {
      evt.y = -this.maxHeight;
    } else {
      evt.y += evt.deltaY;
    }
  }

  settingsAll(): void {
    this.translateService.get('seo.example-page').subscribe((trans) => {
      this.label = trans.title;
      this.description = trans.description;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(this.label);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });

    this.maxHeight = (this.content.clientHeight || this.content.offsetHeight) - window.innerHeight;

    this.init();
  }

  init(): void {
    this.initThree();
    this.initTimeline();
    this.canvas.addEventListener('resize', this.resize, { passive: true });
    this.animate();
  }

  initThree(): void {
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setClearColor(0x161216);
    this.camera.position.y = 10;
    this.camera.position.z = 150;
    this.resize();
    this.addCube();
  }

  resize(): void {
    this.maxHeight = (this.content.clientHeight || this.content.offsetHeight) - window.innerHeight;

    this.renderer.width = this.canvas.clientWidth;
    this.renderer.height = this.canvas.clientHeight;
    this.renderer.setSize(this.renderer.width, this.renderer.height);
    this.camera.aspect = this.renderer.width / this.renderer.height;
    this.camera.updateProjectionMatrix();
  }

  addCube(): void {
    this.cube = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshNormalMaterial());
    this.cube.position.y = 5;
    this.cube.position.z = 1;
    this.scene.add(this.cube);
  }

  animate(): void {
    this.zone.runOutsideAngular(() => {
      const animate = () => {
        const dtime = Date.now() - this.startTime;

        requestAnimationFrame(animate);

        this.percentage = this.lerp(this.percentage, -this.event.y, 0.07);

        this.timeline.seek(this.percentage * (4500 / this.maxHeight));

        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.0125;
        this.cube.rotation.z += 0.012;

        this.renderer.render(this.scene, this.camera);
      };
      animate();
    });
  }

  lerp(a: number, b: number, t: number): number {
    return (1 - t) * a + t * b;
  }

  initTimeline(): void {
    this.timeline = anime.timeline({
      autoplay: false,
      duration: 4500,
      easing: 'easeOutSine',
    });

    this.timeline.add({
      targets: this.cube.position,
      x: 100,
      y: 25,
      z: -50,
      duration: 2250,
      update: this.camera.updateProjectionMatrix(),
    });

    this.timeline.add({
      targets: this.cube.position,
      x: 0,
      y: 0,
      z: 50,
      duration: 2250,
      update: this.camera.updateProjectionMatrix(),
    });

    const value = new THREE.Color(0xfffcfc);
    const initial = new THREE.Color(0x161216);

    this.timeline.add(
      {
        targets: initial,
        r: [initial.r, value.r],
        g: [initial.g, value.g],
        b: [initial.b, value.b],
        duration: 4500,
        update: () => {
          this.renderer.setClearColor(initial);
        },
      },
      0
    );
  }
}
