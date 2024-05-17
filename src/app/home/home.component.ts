import {Component, OnInit} from '@angular/core';
// import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';


import {MenuItem} from 'primeng/api';

import {IBreadCrumbItem} from "../core/interface/index.interface";
import {IDataProps} from '../defaul-card/defaul-card.component';


interface IRootDocument {
  id: number;
  name: string;
  type: 'file' | 'folder';
  childDocuments: IDataProps[] | [];
  parentId?: number;
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  breadCrumb: {
    items: MenuItem[],
    home: MenuItem | undefined
  } = {
    items: [],
    home: undefined
  }

  constructor(private http: HttpClient) {
  }

  folderData: IDataProps[] = [
    {
      id: 0,
      name: '',
      type: 'folder',
    },
  ];
  fileData: IDataProps[] = [
    {
      id: 0,
      name: '',
      type: 'file',
      url: '',
    },
  ];
  isCreateModal: boolean = false;
  folderCreate = {
    name: '',
    type: 'folder',
  };

  ngOnInit(): void {
    this.breadCrumb.items.push({label: 'Tài liệu', id: '6', index: 1})
    this.handleGetDocuments({id: 6, name: ''})
  }

  handleGetDocuments(data: { id: number, name: string }) {
    console.log('handleGetDocument: ==============> ', data)
    this.http
      .get<IRootDocument>(`http://192.168.1.44:8082/document/${data.id}`)
      .subscribe((res: IRootDocument) => {
        const arrFile: IDataProps[] = [];
        const arrFolder: IDataProps[] = [];
        if (res.childDocuments.length > 0) {
          res.childDocuments.forEach((item) => {
            if (item.type === 'file') {
              arrFile.push(item);
            } else {
              arrFolder.push(item);
            }
          });
          this.folderData = [...arrFolder];
          this.fileData = [...arrFile];
        } else {
          this.folderData = [];
          this.fileData = [];
        }
        if (res && data.name !== '' && !this.breadCrumb.items.find((value) => Number(value.id) === data.id)) {
          this.breadCrumb.items = [...this.breadCrumb.items, {
            label: data.name,
            id: `${data.id}`,
            index: this.breadCrumb.items.length + 1
          }]
        }
      });
  }

  handleClickBreadCrumd(item: IBreadCrumbItem) {
    this.breadCrumb.items = this.breadCrumb.items.slice(0, item.index)
    this.handleGetDocuments({id: Number(item.id), name: item.label})
  }

  onShowCreateModal(): void {
    this.isCreateModal = true;
  }

  onCreateConfirm(): void {
    this.isCreateModal = false;
    //api
  }

  onCancelModal(): void {
    this.isCreateModal = false;
  }

  onUpload(event: any): void {
    console.log("🚀 ~ HomeComponent ~ onUpload ~ event:", event)

  }
}
